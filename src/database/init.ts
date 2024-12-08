import { MongoClient } from 'mongodb';

async function initDatabase() {
  const url = process.env.MONGODB_URL || 'mongodb://localhost:27017';
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db('exam_system');
    
    // 获取所有集合
    const collections = await db.listCollections().toArray();
    
    // 删除所有现有集合
    for (const collection of collections) {
      await db.collection(collection.name).drop();
    }
    
    // 创建新的集合
    const collectionNames = ['user', 'role']; // 添加你需要的所有集合名称
    
    for (const name of collectionNames) {
      try {
        await db.createCollection(name);
        console.log(`Collection ${name} created successfully`);
        
        // 为不同的集合创建所需的索引
        if (name === 'user') {
          await db.collection(name).createIndex(
            { username: 1 }, 
            { unique: true }
          );
        }
        // 可以添加其他集合的索引
      } catch (error) {
        console.error(`Error creating collection ${name}:`, error);
      }
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await client.close();
  }
}

initDatabase();