import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getUserId} from '../utils';
import {TodoService} from '../../services/todoService';
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  logger.info('about to delete item', {todoId: todoId})

  const userId = getUserId(event)

  logger.info('got userId for event', {userId: userId})

  const service = new TodoService();
  await service.deleteItem(userId, todoId);

  logger.info('deleted item', {userId: userId, todoId: todoId})

  return {
    statusCode: 200,
    body: '',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
  };
}
