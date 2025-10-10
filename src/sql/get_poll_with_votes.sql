SELECT
  p.id,
  p.question,
  po.id as option_id,
  po.option_text,
  COUNT(v.id) as vote_count
FROM
  polls p
JOIN
  poll_options po ON p.id = po.poll_id
LEFT JOIN
  votes v ON po.id = v.option_id
WHERE
  p.id = @poll_id
GROUP BY
  p.id, po.id;
