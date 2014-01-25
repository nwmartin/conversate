class SearchResult
  attr_reader :result_type, :result_id, :rank, :headline,
              :conversation_title, :conversation_participants

  def initialize(type, result)
    @result_type = type
    @result_id = result[0]
    @rank = result[1]
    @headline = result[2]
    @conversation_title = result[3]
    @conversation_participants = JSON.load(result[4])
  end

  def SearchResult.actions(query)
    conn = ActiveRecord::Base.connection
    escaped_query = conn.quote(query)

    conn.exec_query("
      select act.id, ts_rank_cd(search_vector, query, 32) as rank,
             ts_headline((data->'text')::text, query) as headline,
             cnv.title, cnv.id, json_agg(users.full_name)
      from plainto_tsquery(#{escaped_query}) query, actions as act
      join conversations as cnv
      on act.conversation_id = cnv.id
      join reading_logs
      on cnv.id = reading_logs.conversation_id
      join users
      on reading_logs.user_id = users.id
      where search_vector @@ query
      group by act.id, rank, headline, cnv.title, cnv.id
      order by rank
    ")
  end
end
