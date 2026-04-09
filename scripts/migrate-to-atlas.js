const { MongoClient } = require('mongodb');
require('dotenv').config();

const LOCAL_URI = 'mongodb://127.0.0.1:27017/soet_portal';
const ATLAS_URI = process.env.MONGO_URI;

async function migrateData() {
    console.log('🔄 Starting data migration...');

    const localClient = new MongoClient(LOCAL_URI);
    const atlasClient = new MongoClient(ATLAS_URI);

    try {
        await localClient.connect();
        await atlasClient.connect();
        
        console.log('✅ Connected to both Local and Atlas databases.');

        const localDb = localClient.db('soet_portal');
        
        // Ensure proper URI parsing or just assume Atlas DB name extracted from URI
        const atlasDbName = ATLAS_URI.split('/').pop().split('?')[0];
        const atlasDb = atlasClient.db(atlasDbName);

        // Get all collections from the local database
        const collections = await localDb.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        console.log(`📂 Found ${collectionNames.length} collections to migrate: ${collectionNames.join(', ')}`);

        if (collectionNames.length === 0) {
            console.log('⚠️ No collections found in local database.');
            return;
        }

        for (const name of collectionNames) {
            console.log(`\n⏳ Migrating collection: [${name}] ...`);
            const localCollection = localDb.collection(name);
            const atlasCollection = atlasDb.collection(name);

            // Fetch all documents from local collection
            const documents = await localCollection.find({}).toArray();

            if (documents.length > 0) {
                // To avoid duplicate key errors, we'll clear the destination collection first
                // or just insert if it's empty. Let's clear it to do a fresh sync.
                await atlasCollection.deleteMany({});
                console.log(`  🗑️  Cleared existing data in Atlas for [${name}]`);

                // Insert documents in bulk
                const result = await atlasCollection.insertMany(documents);
                console.log(`  ✅ Successfully migrated ${result.insertedCount} documents to [${name}].`);
            } else {
                console.log(`  ⏩ Skipped [${name}] (No documents found)`);
            }
        }

        console.log('\n🎉 Migration completed successfully!');

    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        await localClient.close();
        await atlasClient.close();
        console.log('🔌 Connections closed.');
    }
}

migrateData();
