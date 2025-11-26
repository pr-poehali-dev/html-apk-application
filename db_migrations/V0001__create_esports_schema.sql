-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    is_admin BOOLEAN DEFAULT FALSE,
    rating INTEGER DEFAULT 1000,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    kda DECIMAL(4,2) DEFAULT 0,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Создание таблицы турниров
CREATE TABLE IF NOT EXISTS tournaments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'UPCOMING',
    prize_money VARCHAR(50),
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    game_title VARCHAR(100),
    tournament_format VARCHAR(50),
    rules TEXT,
    image_url TEXT,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы участников турниров
CREATE TABLE IF NOT EXISTS tournament_participants (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER,
    user_id INTEGER,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'REGISTERED',
    UNIQUE(tournament_id, user_id)
);

-- Создание таблицы матчей
CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER,
    player1_id INTEGER,
    player2_id INTEGER,
    player1_score INTEGER DEFAULT 0,
    player2_score INTEGER DEFAULT 0,
    winner_id INTEGER,
    match_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'SCHEDULED',
    round_number INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы достижений
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    max_progress INTEGER DEFAULT 100,
    achievement_type VARCHAR(50)
);

-- Создание таблицы прогресса достижений пользователей
CREATE TABLE IF NOT EXISTS user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    achievement_id INTEGER,
    current_progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_user ON tournament_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches(tournament_id);

-- Вставка тестовых достижений
INSERT INTO achievements (title, description, icon, max_progress, achievement_type) VALUES
('Мастер Хедшотов', 'Сделай 100 хедшотов', 'Target', 100, 'kills'),
('Серия Побед', 'Выиграй 20 матчей подряд', 'Flame', 20, 'wins'),
('Элита Турниров', 'Выиграй 10 турниров', 'Trophy', 10, 'tournaments');