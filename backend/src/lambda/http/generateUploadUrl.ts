import 'source-map-support/register';

import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda';
import {getUserId} from '../utils';
import {TodoService} from '../../services/todoService';
import {createLogger} from '../../utils/logger';

const logger = createLogger('auth');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId;

    logger.info('about to generate upload url', {todoId: todoId});

    const userId = getUserId(event);
    const service = new TodoService();

    const isValidTodoId = await service.todoIdExists(todoId, userId);
    if (!isValidTodoId) {
        logger.error('invalid todo id', {todoId: todoId});
        return {
            statusCode: 404,
            body: JSON.stringify({
                error: 'todo id doesn\'t exist!'
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            }
        };
    }

    await service.updateTodoAttachment(todoId, userId);

    const url = service.getUploadUrl(todoId);

    logger.info('successfully retrieved upload url', {todoId: todoId});

    return {
        statusCode: 201,
        body: JSON.stringify({
            uploadUrl: url
        }),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        }
    };
};
