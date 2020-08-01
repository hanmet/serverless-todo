import 'source-map-support/register';

import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda';
import {getUserId} from '../utils';
import {TodoService} from '../../services/todoService';
import {createLogger} from '../../utils/logger';

const logger = createLogger('auth');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);

    logger.info('about to request all todos for userId', {userId: userId});

    const service = new TodoService();
    const result = await service.getItems(userId);

    logger.info('retrieved items for user', {userId: userId, items: result});

    return {
        statusCode: 200,
        body: JSON.stringify({items: result}),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        }
    };
};
