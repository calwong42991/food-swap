const db = require('./config');

class Trade {
  static getTradesById({ id }) {
    const queryString = 'SELECT trade.id, (SELECT username FROM users WHERE id = user_id1) as username1, (SELECT dishname FROM food WHERE id = food_id1) as food1, (SELECT username FROM users WHERE id = user_id2) as username2, (SELECT dishname FROM food WHERE id = food_id2) as food2, expired, accepted, failed, trade_date, user_id1_rating, user_id2_rating FROM trade WHERE id = $1';
    return db.any(queryString, [id]);
  }

  static getTradesByUsername({ username }) {
    const queryString = 'SELECT trade.id, (SELECT username FROM users WHERE id = user_id1) as username1, (SELECT dishname FROM food WHERE id = food_id1) as food1, (SELECT username FROM users WHERE id = user_id2) as username2, (SELECT dishname FROM food WHERE id = food_id2) as food2, expired, accepted, failed, trade_date, user_id1_rating, user_id2_rating FROM trade WHERE user_id1=(SELECT id FROM users WHERE username=$1 LIMIT 1) OR user_id2=(SELECT id FROM users WHERE username=$1 LIMIT 1)';
    return db.any(queryString, [username]);
  }

  static getTradesByUserId({ userId }) {
    const queryString = 'SELECT trade.id, (SELECT username FROM users WHERE id = user_id1) as username1, (SELECT dishname FROM food WHERE id = food_id1) as food1, (SELECT username FROM users WHERE id = user_id2) as username2, (SELECT dishname FROM food WHERE id = food_id2) as food2, expired, accepted, failed, trade_date, user_id1_rating, user_id2_rating FROM trade WHERE user_id1=$1 OR user_id2=$1';
    return db.any(queryString, [userId]);
  }

  static getTradesByTwoUsernames({ username1, username2 }) {
    const queryString = `
      SELECT 
        trade.id, 
        (SELECT username FROM users WHERE id = user_id1) as username1,
        (SELECT dishname FROM food WHERE id = food_id1) as food1,
        (SELECT username FROM users WHERE id = user_id2) as username2,
        (SELECT dishname FROM food WHERE id = food_id2) as food2,
        expired,
        accepted,
        failed,
        trade_date,
        user_id1_rating,
        user_id2_rating FROM trade
      WHERE 
        (user_id1=(SELECT id FROM users WHERE username=$1 LIMIT 1) AND user_id2=(SELECT id FROM users WHERE username=$2 LIMIT 1)) 
      OR 
        (user_id1=(SELECT id FROM users WHERE username=$2 LIMIT 1) AND user_id2=(SELECT id FROM users WHERE username=$1 LIMIT 1))`;
    
    return db.query(queryString, [username1, username2]);
  }

  static getTradesByTwoUserIds({ userId1, userId2 }) {
    const queryString = `
    SELECT 
      trade.id, 
      (SELECT username FROM users WHERE id = user_id1) as username1,
      (SELECT dishname FROM food WHERE id = food_id1) as food1,
      (SELECT username FROM users WHERE id = user_id2) as username2,
      (SELECT dishname FROM food WHERE id = food_id2) as food2,
      expired,
      accepted,
      failed,
      trade_date,
      user_id1_rating,
      user_id2_rating FROM trade
    WHERE 
      (user_id1=$1 AND user_id2=$2) 
    OR 
      (user_id1=$2 AND user_id2=$1)`;
    return db.query(queryString, [userId1, userId2]);
  }

  static initiate({ userId1, foodId1, userId2, foodId2 }) {
    const queryString = 'INSERT INTO trade (user_id1, food_id1, user_id2, food_id2) VALUES ($1, $2, $3, $4)';
    return db.any(queryString, [userId1, foodId1, userId2, foodId2]);
  }

  static accept({ id }) {
    const queryString = 'UPDATE trade SET accepted = TRUE WHERE id = $1';
    return db.any(queryString, [id]);
  }

  static reject({ id }) {
    const queryString = 'UPDATE trade SET failed = TRUE WHERE id = $1';
    return db.any(queryString, [id]);
  }

  static remove({ id }) {
    const queryString = 'DELETE FROM trade WHERE id = $1';
    return db.any(queryString, [id]);
  }
}

module.exports = Trade;
