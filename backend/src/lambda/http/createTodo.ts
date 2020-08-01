import 'source-map-support/register';

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';

import {CreateTodoRequest} from '../../requests/CreateTodoRequest';
import {getUserId} from '../utils';
import {TodoService} from '../../services/todoService';
import {v4 as uuidv4} from 'uuid';
import {createLogger} from '../../utils/logger';

const logger = createLogger('auth');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body);

    const timestamp = new Date().toISOString();
    const todoId = uuidv4();
    const userId = getUserId(event);

    const newItem = {
        todoId,
        userId,
        createdAt: timestamp,
        done: false,
        attachmentUrl: '',
        ...newTodo
    };

    const service = new TodoService();
    const result = await service.createItem(newItem);

    logger.info('new todo item was created', {newItem: result});

    return {
        statusCode: 200,
        body: JSON.stringify({item: result}),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        }
    };
};
