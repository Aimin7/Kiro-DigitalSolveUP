// DynamoDBService 구현
// DynamoDB CRUD 작업 서비스

const { dynamodb } = require('../config/aws');
const { info, error, debug } = require('../utils/logger');
const environment = require('../config/environment');

/**
 * DynamoDB 서비스 클래스
 */
class DynamoDBService {
  constructor() {
    this.tableName = environment.dynamodbTableName;
    this.client = dynamodb;
  }

  /**
   * 아이템 생성/업데이트
   * @param {Object} item - 저장할 아이템
   * @returns {Promise<Object>} 결과
   */
  async putItem(item) {
    try {
      debug('DynamoDB putItem', { tableName: this.tableName, itemId: item.id });

      const params = {
        TableName: this.tableName,
        Item: item,
        ReturnValues: 'ALL_OLD',
      };

      const result = await this.client.put(params).promise();
      
      info('DynamoDB item saved successfully', { 
        itemId: item.id,
        isUpdate: !!result.Attributes,
      });

      return {
        success: true,
        data: item,
        isUpdate: !!result.Attributes,
        previousData: result.Attributes,
      };
    } catch (err) {
      error('Failed to put item to DynamoDB', err, { 
        tableName: this.tableName,
        itemId: item.id,
      });
      
      throw new Error(`DynamoDB put operation failed: ${err.message}`);
    }
  }

  /**
   * 아이템 조회
   * @param {string} id - 아이템 ID
   * @returns {Promise<Object|null>} 아이템 또는 null
   */
  async getItem(id) {
    try {
      debug('DynamoDB getItem', { tableName: this.tableName, id });

      const params = {
        TableName: this.tableName,
        Key: { id },
      };

      const result = await this.client.get(params).promise();
      
      if (!result.Item) {
        debug('Item not found', { id });
        return null;
      }

      info('DynamoDB item retrieved successfully', { id });
      return result.Item;
    } catch (err) {
      error('Failed to get item from DynamoDB', err, { 
        tableName: this.tableName,
        id,
      });
      
      throw new Error(`DynamoDB get operation failed: ${err.message}`);
    }
  }

  /**
   * 아이템 삭제
   * @param {string} id - 아이템 ID
   * @returns {Promise<Object>} 결과
   */
  async deleteItem(id) {
    try {
      debug('DynamoDB deleteItem', { tableName: this.tableName, id });

      const params = {
        TableName: this.tableName,
        Key: { id },
        ReturnValues: 'ALL_OLD',
      };

      const result = await this.client.delete(params).promise();
      
      info('DynamoDB item deleted successfully', { 
        id,
        existed: !!result.Attributes,
      });

      return {
        success: true,
        existed: !!result.Attributes,
        deletedData: result.Attributes,
      };
    } catch (err) {
      error('Failed to delete item from DynamoDB', err, { 
        tableName: this.tableName,
        id,
      });
      
      throw new Error(`DynamoDB delete operation failed: ${err.message}`);
    }
  }

  /**
   * 위치 기반 아이템 조회
   * @param {string} locationId - 위치 ID
   * @param {Object} options - 조회 옵션
   * @returns {Promise<Array>} 아이템 배열
   */
  async getItemsByLocation(locationId, options = {}) {
    try {
      debug('DynamoDB getItemsByLocation', { 
        tableName: this.tableName,
        locationId,
        options,
      });

      const params = {
        TableName: this.tableName,
        IndexName: 'LocationIndex',
        KeyConditionExpression: 'locationId = :locationId',
        ExpressionAttributeValues: {
          ':locationId': locationId,
        },
      };

      // 정렬 옵션
      if (options.sortDescending) {
        params.ScanIndexForward = false;
      }

      // 제한 옵션
      if (options.limit) {
        params.Limit = options.limit;
      }

      // 시작 키 (페이지네이션)
      if (options.exclusiveStartKey) {
        params.ExclusiveStartKey = options.exclusiveStartKey;
      }

      // 필터 표현식
      if (options.status) {
        params.FilterExpression = '#status = :status';
        params.ExpressionAttributeNames = { '#status': 'status' };
        params.ExpressionAttributeValues[':status'] = options.status;
      }

      const result = await this.client.query(params).promise();
      
      info('DynamoDB location query completed', { 
        locationId,
        itemCount: result.Items.length,
        hasMore: !!result.LastEvaluatedKey,
      });

      return {
        items: result.Items,
        lastEvaluatedKey: result.LastEvaluatedKey,
        count: result.Count,
        scannedCount: result.ScannedCount,
      };
    } catch (err) {
      error('Failed to query items by location', err, { 
        tableName: this.tableName,
        locationId,
      });
      
      throw new Error(`DynamoDB location query failed: ${err.message}`);
    }
  }

  /**
   * API 타입별 아이템 조회
   * @param {string} apiType - API 타입
   * @param {Object} options - 조회 옵션
   * @returns {Promise<Array>} 아이템 배열
   */
  async getItemsByAPIType(apiType, options = {}) {
    try {
      debug('DynamoDB getItemsByAPIType', { 
        tableName: this.tableName,
        apiType,
        options,
      });

      const params = {
        TableName: this.tableName,
        IndexName: 'APITypeIndex',
        KeyConditionExpression: 'apiType = :apiType',
        ExpressionAttributeValues: {
          ':apiType': apiType,
        },
      };

      // 시간 범위 필터
      if (options.fromTime) {
        params.KeyConditionExpression += ' AND #timestamp >= :fromTime';
        params.ExpressionAttributeNames = { '#timestamp': 'timestamp' };
        params.ExpressionAttributeValues[':fromTime'] = options.fromTime;
      }

      if (options.toTime) {
        if (options.fromTime) {
          params.KeyConditionExpression += ' AND #timestamp <= :toTime';
        } else {
          params.KeyConditionExpression += ' AND #timestamp <= :toTime';
          params.ExpressionAttributeNames = { '#timestamp': 'timestamp' };
        }
        params.ExpressionAttributeValues[':toTime'] = options.toTime;
      }

      // 정렬 및 제한
      if (options.sortDescending) {
        params.ScanIndexForward = false;
      }

      if (options.limit) {
        params.Limit = options.limit;
      }

      const result = await this.client.query(params).promise();
      
      info('DynamoDB API type query completed', { 
        apiType,
        itemCount: result.Items.length,
      });

      return {
        items: result.Items,
        lastEvaluatedKey: result.LastEvaluatedKey,
        count: result.Count,
      };
    } catch (err) {
      error('Failed to query items by API type', err, { 
        tableName: this.tableName,
        apiType,
      });
      
      throw new Error(`DynamoDB API type query failed: ${err.message}`);
    }
  }

  /**
   * 상태별 아이템 조회
   * @param {string} status - 상태 (active, resolved)
   * @param {Object} options - 조회 옵션
   * @returns {Promise<Array>} 아이템 배열
   */
  async getItemsByStatus(status, options = {}) {
    try {
      debug('DynamoDB getItemsByStatus', { 
        tableName: this.tableName,
        status,
        options,
      });

      const params = {
        TableName: this.tableName,
        IndexName: 'StatusIndex',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': status,
        },
      };

      // 시간 범위 필터
      if (options.fromTime || options.toTime) {
        params.ExpressionAttributeNames['#timestamp'] = 'timestamp';
        
        if (options.fromTime && options.toTime) {
          params.KeyConditionExpression += ' AND #timestamp BETWEEN :fromTime AND :toTime';
          params.ExpressionAttributeValues[':fromTime'] = options.fromTime;
          params.ExpressionAttributeValues[':toTime'] = options.toTime;
        } else if (options.fromTime) {
          params.KeyConditionExpression += ' AND #timestamp >= :fromTime';
          params.ExpressionAttributeValues[':fromTime'] = options.fromTime;
        } else if (options.toTime) {
          params.KeyConditionExpression += ' AND #timestamp <= :toTime';
          params.ExpressionAttributeValues[':toTime'] = options.toTime;
        }
      }

      if (options.limit) {
        params.Limit = options.limit;
      }

      const result = await this.client.query(params).promise();
      
      info('DynamoDB status query completed', { 
        status,
        itemCount: result.Items.length,
      });

      return {
        items: result.Items,
        lastEvaluatedKey: result.LastEvaluatedKey,
        count: result.Count,
      };
    } catch (err) {
      error('Failed to query items by status', err, { 
        tableName: this.tableName,
        status,
      });
      
      throw new Error(`DynamoDB status query failed: ${err.message}`);
    }
  }

  /**
   * 배치 쓰기 작업
   * @param {Array} items - 저장할 아이템 배열
   * @returns {Promise<Object>} 결과
   */
  async batchWriteItems(items) {
    try {
      debug('DynamoDB batchWriteItems', { 
        tableName: this.tableName,
        itemCount: items.length,
      });

      if (!items || items.length === 0) {
        return { success: true, processedItems: 0, unprocessedItems: [] };
      }

      // DynamoDB 배치 쓰기는 최대 25개 아이템
      const batches = [];
      for (let i = 0; i < items.length; i += 25) {
        batches.push(items.slice(i, i + 25));
      }

      let processedItems = 0;
      let unprocessedItems = [];

      for (const batch of batches) {
        const params = {
          RequestItems: {
            [this.tableName]: batch.map(item => ({
              PutRequest: {
                Item: item,
              },
            })),
          },
        };

        const result = await this.client.batchWrite(params).promise();
        
        processedItems += batch.length;
        
        // 처리되지 않은 아이템 처리
        if (result.UnprocessedItems && result.UnprocessedItems[this.tableName]) {
          unprocessedItems.push(...result.UnprocessedItems[this.tableName]);
        }
      }

      info('DynamoDB batch write completed', { 
        totalItems: items.length,
        processedItems,
        unprocessedItems: unprocessedItems.length,
      });

      return {
        success: true,
        processedItems,
        unprocessedItems,
        totalItems: items.length,
      };
    } catch (err) {
      error('Failed to batch write items', err, { 
        tableName: this.tableName,
        itemCount: items.length,
      });
      
      throw new Error(`DynamoDB batch write failed: ${err.message}`);
    }
  }

  /**
   * 배치 삭제 작업
   * @param {Array<string>} ids - 삭제할 아이템 ID 배열
   * @returns {Promise<Object>} 결과
   */
  async batchDeleteItems(ids) {
    try {
      debug('DynamoDB batchDeleteItems', { 
        tableName: this.tableName,
        itemCount: ids.length,
      });

      if (!ids || ids.length === 0) {
        return { success: true, deletedItems: 0, unprocessedItems: [] };
      }

      // DynamoDB 배치 삭제는 최대 25개 아이템
      const batches = [];
      for (let i = 0; i < ids.length; i += 25) {
        batches.push(ids.slice(i, i + 25));
      }

      let deletedItems = 0;
      let unprocessedItems = [];

      for (const batch of batches) {
        const params = {
          RequestItems: {
            [this.tableName]: batch.map(id => ({
              DeleteRequest: {
                Key: { id },
              },
            })),
          },
        };

        const result = await this.client.batchWrite(params).promise();
        
        deletedItems += batch.length;
        
        // 처리되지 않은 아이템 처리
        if (result.UnprocessedItems && result.UnprocessedItems[this.tableName]) {
          unprocessedItems.push(...result.UnprocessedItems[this.tableName]);
        }
      }

      info('DynamoDB batch delete completed', { 
        totalItems: ids.length,
        deletedItems,
        unprocessedItems: unprocessedItems.length,
      });

      return {
        success: true,
        deletedItems,
        unprocessedItems,
        totalItems: ids.length,
      };
    } catch (err) {
      error('Failed to batch delete items', err, { 
        tableName: this.tableName,
        itemCount: ids.length,
      });
      
      throw new Error(`DynamoDB batch delete failed: ${err.message}`);
    }
  }

  /**
   * 전체 스캔 (주의: 비용이 많이 듦)
   * @param {Object} options - 스캔 옵션
   * @returns {Promise<Array>} 아이템 배열
   */
  async scanItems(options = {}) {
    try {
      debug('DynamoDB scanItems', { 
        tableName: this.tableName,
        options,
      });

      const params = {
        TableName: this.tableName,
      };

      // 필터 표현식
      if (options.filterExpression) {
        params.FilterExpression = options.filterExpression;
      }

      if (options.expressionAttributeNames) {
        params.ExpressionAttributeNames = options.expressionAttributeNames;
      }

      if (options.expressionAttributeValues) {
        params.ExpressionAttributeValues = options.expressionAttributeValues;
      }

      // 제한
      if (options.limit) {
        params.Limit = options.limit;
      }

      // 시작 키
      if (options.exclusiveStartKey) {
        params.ExclusiveStartKey = options.exclusiveStartKey;
      }

      const result = await this.client.scan(params).promise();
      
      info('DynamoDB scan completed', { 
        itemCount: result.Items.length,
        scannedCount: result.ScannedCount,
        hasMore: !!result.LastEvaluatedKey,
      });

      return {
        items: result.Items,
        lastEvaluatedKey: result.LastEvaluatedKey,
        count: result.Count,
        scannedCount: result.ScannedCount,
      };
    } catch (err) {
      error('Failed to scan items', err, { 
        tableName: this.tableName,
      });
      
      throw new Error(`DynamoDB scan failed: ${err.message}`);
    }
  }

  /**
   * 조건부 업데이트
   * @param {string} id - 아이템 ID
   * @param {Object} updateExpression - 업데이트 표현식
   * @param {Object} conditionExpression - 조건 표현식
   * @returns {Promise<Object>} 결과
   */
  async conditionalUpdate(id, updateExpression, conditionExpression = null) {
    try {
      debug('DynamoDB conditionalUpdate', { 
        tableName: this.tableName,
        id,
        updateExpression,
        conditionExpression,
      });

      const params = {
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: updateExpression.expression,
        ExpressionAttributeValues: updateExpression.values,
        ReturnValues: 'ALL_NEW',
      };

      if (updateExpression.names) {
        params.ExpressionAttributeNames = updateExpression.names;
      }

      if (conditionExpression) {
        params.ConditionExpression = conditionExpression.expression;
        if (conditionExpression.values) {
          params.ExpressionAttributeValues = {
            ...params.ExpressionAttributeValues,
            ...conditionExpression.values,
          };
        }
        if (conditionExpression.names) {
          params.ExpressionAttributeNames = {
            ...params.ExpressionAttributeNames,
            ...conditionExpression.names,
          };
        }
      }

      const result = await this.client.update(params).promise();
      
      info('DynamoDB conditional update completed', { 
        id,
        updated: !!result.Attributes,
      });

      return {
        success: true,
        data: result.Attributes,
      };
    } catch (err) {
      if (err.code === 'ConditionalCheckFailedException') {
        info('DynamoDB conditional update failed - condition not met', { id });
        return {
          success: false,
          reason: 'CONDITION_NOT_MET',
          error: err.message,
        };
      }

      error('Failed to conditionally update item', err, { 
        tableName: this.tableName,
        id,
      });
      
      throw new Error(`DynamoDB conditional update failed: ${err.message}`);
    }
  }

  /**
   * 트랜잭션 쓰기
   * @param {Array} transactItems - 트랜잭션 아이템 배열
   * @returns {Promise<Object>} 결과
   */
  async transactWrite(transactItems) {
    try {
      debug('DynamoDB transactWrite', { 
        tableName: this.tableName,
        itemCount: transactItems.length,
      });

      const params = {
        TransactItems: transactItems.map(item => {
          if (item.Put) {
            return {
              Put: {
                TableName: this.tableName,
                ...item.Put,
              },
            };
          }
          if (item.Update) {
            return {
              Update: {
                TableName: this.tableName,
                ...item.Update,
              },
            };
          }
          if (item.Delete) {
            return {
              Delete: {
                TableName: this.tableName,
                ...item.Delete,
              },
            };
          }
          return item;
        }),
      };

      await this.client.transactWrite(params).promise();
      
      info('DynamoDB transaction write completed', { 
        itemCount: transactItems.length,
      });

      return {
        success: true,
        processedItems: transactItems.length,
      };
    } catch (err) {
      error('Failed to execute transaction write', err, { 
        tableName: this.tableName,
        itemCount: transactItems.length,
      });
      
      throw new Error(`DynamoDB transaction write failed: ${err.message}`);
    }
  }

  /**
   * 테이블 상태 확인
   * @returns {Promise<Object>} 테이블 상태
   */
  async getTableStatus() {
    try {
      const params = {
        TableName: this.tableName,
      };

      const result = await this.client.describeTable(params).promise();
      
      return {
        tableName: result.Table.TableName,
        status: result.Table.TableStatus,
        itemCount: result.Table.ItemCount,
        tableSize: result.Table.TableSizeBytes,
        creationDateTime: result.Table.CreationDateTime,
        billingMode: result.Table.BillingModeSummary?.BillingMode,
        indexes: result.Table.GlobalSecondaryIndexes?.map(index => ({
          name: index.IndexName,
          status: index.IndexStatus,
          itemCount: index.ItemCount,
        })),
      };
    } catch (err) {
      error('Failed to get table status', err, { 
        tableName: this.tableName,
      });
      
      throw new Error(`Failed to get table status: ${err.message}`);
    }
  }
}

module.exports = DynamoDBService;