SELECT
  p.id,
  p.question,
  p.created_at,
  u.username as creator_username
FROM
  polls p
JOIN
  users u ON p.creator_id = u.id;
