// dynamodb.js
// DynamoDB 클라이언트 설정 및 테이블 스키마 정의

const AWS = require('aws-sdk');
const { info, error, debug } = require('../utils/logger');

/**
 * DynamoDB 설정 클래스
 */
class DynamoDBConfig {
  constructor() {
    this.dynamodb = null;
    this.documentClient = null;
    this.tableSchemas = new Map();
    this.isInitialized = false;
  }

  /**
   * DynamoDB 클라이언트 초기화
   * @param {Object} options - 초기화 옵션
   */
  initialize(options = {}) {
    const {
      region = process.env.AWS_REGION || 'ap-northeast-2',
      endpoint = process.env.DYNAMODB_ENDPOINT,
      accessKeyId = process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY,
    } = options;

    const config = {
      region,
      apiVersion: '2012-08-10',
    };

    // 로컬 개발 환경용 엔드포인트 설정
    if (endpoint) {
      config.endpoint = endpoint;
    }

    // 자격 증명 설정 (Lambda에서는 IAM 역할 사용)
    if (accessKeyId && secretAccessKey) {
      config.accessKeyId = accessKeyId;
      config.secretAccessKey = secretAccessKey;
    }

    this.dynamodb = new AWS.DynamoDB(config);
    this.documentClient = new AWS.DynamoDB.DocumentClient(config);

    this.defineTableSchemas();
    this.isInitialized = true;

    info('DynamoDB client initialized', { region, endpoint: !!endpoint });
  }

  /**
   * 테이블 스키마 정의
   */
  defineTableSchemas() {
    // FloodInfo 테이블 스키마
    this.tableSchemas.set('FloodInfo', {
      TableName: process.env.FLOOD_INFO_TABLE || 'FloodInfo',
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH', // Partition key
        },
        {
          AttributeName: 'timestamp',
          KeyType: 'RANGE', // Sort key
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'S',
        },
        {
          AttributeName: 'timestamp',
          AttributeType: 'S',
        },
        {
          AttributeName: 'locationId',
          AttributeType: 'S',
        },
        {
          AttributeName: 'status',
          AttributeType: 'S',
        },
        {
          AttributeName: 'severity',
          AttributeType: 'S',
        },
        {
          AttributeName: 'alertType',
          AttributeType: 'S',
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'LocationIndex',
          KeySchema: [
            {
              AttributeName: 'locationId',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'timestamp',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
        {
          IndexName: 'StatusIndex',
          KeySchema: [
            {
              AttributeName: 'status',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'timestamp',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
        {
          IndexName: 'SeverityIndex',
          KeySchema: [
            {
              AttributeName: 'severity',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'timestamp',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
        {
          IndexName: 'AlertTypeIndex',
          KeySchema: [
            {
              AttributeName: 'alertType',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'timestamp',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
      },
      StreamSpecification: {
        StreamEnabled: true,
        StreamViewType: 'NEW_AND_OLD_IMAGES',
      },
      TimeToLiveSpecification: {
        AttributeName: 'ttl',
        Enabled: true,
      },
    });

    // APISource 테이블 스키마
    this.tableSchemas.set('APISource', {
      TableName: process.env.API_SOURCE_TABLE || 'APISource',
      KeySchema: [
        {
          AttributeName: 'sourceId',
          KeyType: 'HASH', // Partition key
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'sourceId',
          AttributeType: 'S',
        },
        {
          AttributeName: 'apiType',
          AttributeType: 'S',
        },
        {
          AttributeName: 'status',
          AttributeType: 'S',
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'APITypeIndex',
          KeySchema: [
            {
              AttributeName: 'apiType',
              KeyType: 'HASH',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
        {
          IndexName: 'StatusIndex',
          KeySchema: [
            {
              AttributeName: 'status',
              KeyType: 'HASH',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    });

    debug('Table schemas defined', { 
      tableCount: this.tableSchemas.size,
      tables: Array.from(this.tableSchemas.keys()),
    });
  }

  /**
   * 테이블 생성
   * @param {string} tableName - 테이블 이름
   * @returns {Promise<boolean>} 생성 성공 여부
   */
  async createTable(tableName) {
    if (!this.isInitialized) {
      throw new Error('DynamoDB client not initialized');
    }

    const schema = this.tableSchemas.get(tableName);
    if (!schema) {
      throw new Error(`Table schema not found: ${tableName}`);
    }

    try {
      // 테이블 존재 여부 확인
      const exists = await this.tableExists(schema.TableName);
      if (exists) {
        info('Table already exists', { tableName: schema.TableName });
        return true;
      }

      // 테이블 생성
      debug('Creating table', { tableName: schema.TableName });
      await this.dynamodb.createTable(schema).promise();

      // 테이블 활성화 대기
      await this.waitForTableActive(schema.TableName);

      info('Table created successfully', { tableName: schema.TableName });
      return true;
    } catch (err) {
      error('Failed to create table', err, { tableName: schema.TableName });
      throw err;
    }
  }

  /**
   * 모든 테이블 생성
   * @returns {Promise<boolean>} 생성 성공 여부
   */
  async createAllTables() {
    const tableNames = Array.from(this.tableSchemas.keys());
    
    try {
      for (const tableName of tableNames) {
        await this.createTable(tableName);
      }
      
      info('All tables created successfully', { tableCount: tableNames.length });
      return true;
    } catch (err) {
      error('Failed to create all tables', err);
      throw err;
    }
  }

  /**
   * 테이블 존재 여부 확인
   * @param {string} tableName - 테이블 이름
   * @returns {Promise<boolean>} 존재 여부
   */
  async tableExists(tableName) {
    try {
      await this.dynamodb.describeTable({ TableName: tableName }).promise();
      return true;
    } catch (err) {
      if (err.code === 'ResourceNotFoundException') {
        return false;
      }
      throw err;
    }
  }

  /**
   * 테이블 활성화 대기
   * @param {string} tableName - 테이블 이름
   * @param {number} maxWaitTime - 최대 대기 시간 (밀리초)
   * @returns {Promise<void>}
   */
  async waitForTableActive(tableName, maxWaitTime = 300000) { // 5분
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        const result = await this.dynamodb.describeTable({ TableName: tableName }).promise();
        
        if (result.Table.TableStatus === 'ACTIVE') {
          debug('Table is active', { tableName });
          return;
        }
        
        debug('Waiting for table to become active', { 
          tableName, 
          status: result.Table.TableStatus 
        });
        
        // 5초 대기
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (err) {
        error('Error checking table status', err, { tableName });
        throw err;
      }
    }
    
    throw new Error(`Table did not become active within ${maxWaitTime}ms: ${tableName}`);
  }

  /**
   * 테이블 삭제
   * @param {string} tableName - 테이블 이름
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  async deleteTable(tableName) {
    if (!this.isInitialized) {
      throw new Error('DynamoDB client not initialized');
    }

    const schema = this.tableSchemas.get(tableName);
    if (!schema) {
      throw new Error(`Table schema not found: ${tableName}`);
    }

    try {
      const exists = await this.tableExists(schema.TableName);
      if (!exists) {
        info('Table does not exist', { tableName: schema.TableName });
        return true;
      }

      debug('Deleting table', { tableName: schema.TableName });
      await this.dynamodb.deleteTable({ TableName: schema.TableName }).promise();

      info('Table deleted successfully', { tableName: schema.TableName });
      return true;
    } catch (err) {
      error('Failed to delete table', err, { tableName: schema.TableName });
      throw err;
    }
  }

  /**
   * 테이블 스키마 조회
   * @param {string} tableName - 테이블 이름
   * @returns {Object} 테이블 스키마
   */
  getTableSchema(tableName) {
    return this.tableSchemas.get(tableName);
  }

  /**
   * 테이블 이름 조회
   * @param {string} schemaName - 스키마 이름
   * @returns {string} 실제 테이블 이름
   */
  getTableName(schemaName) {
    const schema = this.tableSchemas.get(schemaName);
    return schema ? schema.TableName : null;
  }

  /**
   * DocumentClient 조회
   * @returns {AWS.DynamoDB.DocumentClient} DocumentClient 인스턴스
   */
  getDocumentClient() {
    if (!this.isInitialized) {
      throw new Error('DynamoDB client not initialized');
    }
    return this.documentClient;
  }

  /**
   * DynamoDB 클라이언트 조회
   * @returns {AWS.DynamoDB} DynamoDB 클라이언트 인스턴스
   */
  getDynamoDBClient() {
    if (!this.isInitialized) {
      throw new Error('DynamoDB client not initialized');
    }
    return this.dynamodb;
  }

  /**
   * 테이블 상태 확인
   * @param {string} tableName - 테이블 이름
   * @returns {Promise<Object>} 테이블 상태 정보
   */
  async getTableStatus(tableName) {
    const schema = this.tableSchemas.get(tableName);
    if (!schema) {
      throw new Error(`Table schema not found: ${tableName}`);
    }

    try {
      const result = await this.dynamodb.describeTable({ 
        TableName: schema.TableName 
      }).promise();

      return {
        tableName: schema.TableName,
        status: result.Table.TableStatus,
        itemCount: result.Table.ItemCount,
        tableSize: result.Table.TableSizeBytes,
        creationDateTime: result.Table.CreationDateTime,
        provisionedThroughput: result.Table.ProvisionedThroughput,
        globalSecondaryIndexes: result.Table.GlobalSecondaryIndexes?.map(gsi => ({
          indexName: gsi.IndexName,
          status: gsi.IndexStatus,
          itemCount: gsi.ItemCount,
          indexSize: gsi.IndexSizeBytes,
        })) || [],
      };
    } catch (err) {
      if (err.code === 'ResourceNotFoundException') {
        return {
          tableName: schema.TableName,
          status: 'NOT_EXISTS',
        };
      }
      throw err;
    }
  }

  /**
   * 모든 테이블 상태 확인
   * @returns {Promise<Array>} 모든 테이블 상태 정보
   */
  async getAllTableStatus() {
    const tableNames = Array.from(this.tableSchemas.keys());
    const statusPromises = tableNames.map(tableName => 
      this.getTableStatus(tableName).catch(err => ({
        tableName,
        status: 'ERROR',
        error: err.message,
      }))
    );

    return Promise.all(statusPromises);
  }

  /**
   * TTL 설정
   * @param {string} tableName - 테이블 이름
   * @param {string} attributeName - TTL 속성 이름
   * @returns {Promise<boolean>} 설정 성공 여부
   */
  async enableTTL(tableName, attributeName = 'ttl') {
    const schema = this.tableSchemas.get(tableName);
    if (!schema) {
      throw new Error(`Table schema not found: ${tableName}`);
    }

    try {
      await this.dynamodb.updateTimeToLive({
        TableName: schema.TableName,
        TimeToLiveSpecification: {
          AttributeName: attributeName,
          Enabled: true,
        },
      }).promise();

      info('TTL enabled', { tableName: schema.TableName, attributeName });
      return true;
    } catch (err) {
      error('Failed to enable TTL', err, { tableName: schema.TableName });
      throw err;
    }
  }

  /**
   * 스트림 설정
   * @param {string} tableName - 테이블 이름
   * @param {string} streamViewType - 스트림 뷰 타입
   * @returns {Promise<boolean>} 설정 성공 여부
   */
  async enableStream(tableName, streamViewType = 'NEW_AND_OLD_IMAGES') {
    const schema = this.tableSchemas.get(tableName);
    if (!schema) {
      throw new Error(`Table schema not found: ${tableName}`);
    }

    try {
      await this.dynamodb.updateTable({
        TableName: schema.TableName,
        StreamSpecification: {
          StreamEnabled: true,
          StreamViewType: streamViewType,
        },
      }).promise();

      info('Stream enabled', { tableName: schema.TableName, streamViewType });
      return true;
    } catch (err) {
      error('Failed to enable stream', err, { tableName: schema.TableName });
      throw err;
    }
  }

  /**
   * 헬스 체크
   * @returns {Promise<Object>} 헬스 체크 결과
   */
  async healthCheck() {
    try {
      const tableStatuses = await this.getAllTableStatus();
      
      const healthyTables = tableStatuses.filter(t => t.status === 'ACTIVE').length;
      const totalTables = tableStatuses.length;
      
      const health = {
        status: healthyTables === totalTables ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        tables: {
          total: totalTables,
          healthy: healthyTables,
          unhealthy: totalTables - healthyTables,
        },
        details: tableStatuses,
      };

      return health;
    } catch (err) {
      error('Health check failed', err);
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: err.message,
      };
    }
  }
}

// 싱글톤 인스턴스 생성
const dynamoDBConfig = new DynamoDBConfig();

// 환경 변수가 있으면 자동 초기화
if (process.env.AWS_REGION || process.env.DYNAMODB_ENDPOINT) {
  dynamoDBConfig.initialize();
}

module.exports = {
  DynamoDBConfig,
  dynamoDBConfig,
};