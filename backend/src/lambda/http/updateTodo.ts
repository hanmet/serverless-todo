import 'source-map-support/register';

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';

import {UpdateTodoRequest} from '../../requests/UpdateTodoRequest';
import {getUserId} from '../utils';
import {TodoService} from '../../services/todoService';
import {createLogger} from '../../utils/logger';

const logger = createLogger('auth');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId;
    const userId = getUserId(event);
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);

    logger.info('about to update todo item', {todoId: todoId, userId: userId, updatedTodo: updatedTodo});

    const timestamp = new Date().toISOString();

    const newItem = {
        todoId,
        userId,
        timestamp,
        ...updatedTodo
    };

    const service = new TodoService();
    await service.updateItem(userId, todoId, updatedTodo);

    logger.info('updated item', {todoId: todoId, userId: userId, newItem: newItem});

    return {
        statusCode: 200,
        body: JSON.stringify({newItem}),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        }
    };
};
