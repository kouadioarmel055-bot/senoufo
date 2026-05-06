const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

async function initializeDatabase() {
  console.log('Début de l\'initialisation de la base de données PostgreSQL...');
  
  try {
    // Lire le fichier SQL
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log(`Fichier SQL lu avec succès : ${schemaPath}`);
    
    // Exécuter le script SQL
    await pool.query(sql);
    
    console.log('✅ Base de données initialisée avec succès !');
    console.log('Les tables, vues et fonctions ont été créées, et les données d\'exemple ont été insérées.');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
  } finally {
    // Fermer le pool de connexions
    await pool.end();
    console.log('Connexion à la base de données fermée.');
    process.exit(0);
  }
}

initializeDatabase();
