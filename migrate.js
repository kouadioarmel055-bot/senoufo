const { pool } = require('../config/db');

async function runMigration() {
  console.log('Exécution de la migration SQL...');
  
  const sql = `
    ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS xp INT DEFAULT 0;
    ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS lessons_completed INT DEFAULT 0;
    ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS streak INT DEFAULT 0;
  `;
  
  try {
    await pool.query(sql);
    console.log('Migration réussie : colonnes xp, lessons_completed et streak ajoutées à la table utilisateurs.');
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
  } finally {
    await pool.end();
  }
}

runMigration();
