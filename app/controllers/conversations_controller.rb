class ConversationsController < ApplicationController
  before_filter :require_login

  def index
    render_conversation_view
  end

  def new
    @conversation_errors = []
  end

  def create
    @conversation_errors = []
    conversation = nil
    if params[:users].length > 0
      users = User.find params[:users]
      conversation = Conversation.new({:users => (users << current_user).uniq,
                                       :title => params[:title]})
      @conversation_errors << 'Failed to save conversation' unless conversation.save

      unless params[:first_message].empty?
        message_event = Event.new({:conversation_id => conversation.id,
                                   :user_id => current_user.id,
                                   :event_type => 'message',
                                   :data => {:message_id => conversation.next_message_id,
                                             :text => params[:first_message]}.to_json})
        @conversation_errors << 'Failed to save message event' unless message_event.save
      end
    else
      @conversation_errors << 'No senders'
    end

    if @conversation_errors.length > 0
      render :new
    else
      render_conversation_view conversation
    end
  end

  def show
    render_conversation_view Conversation.find(params[:id])
  end

  def retitle
    conversation = Conversation.find(params[:id])
    render_conversation_view(conversation) and return if params[:title].empty?

    conversation.title = params[:title]
    title_event = Event.new({:conversation_id => conversation.id,
                             :user_id => current_user.id,
                             :event_type => 'retitle',
                             :data => {:title => params[:title]}.to_json})
    conversation.save
    title_event.save
    render_conversation_view conversation
  end

  def write
    conversation = Conversation.find(params[:id])
    render_conversation_view(conversation) and return if params[:text].empty?

    message_event = Event.new({:conversation_id => conversation.id,
                               :user_id => current_user.id,
                               :event_type => 'message',
                               :data => {:message_id => conversation.next_message_id,
                                         :text => params[:text]}.to_json})
    message_event.save
    render_conversation_view conversation
  end

  def delete
    conversation = Conversation.find(params[:id])
    render_conversation_view(conversation) and return if params[:message].empty?

    delete_event = Event.new({:conversation_id => conversation.id,
                              :user_id => current_user.id,
                              :event_type => 'deletion',
                              :data => {:message_id => params[:message].to_i}.to_json})
    delete_event.save
    render_conversation_view conversation
  end

  private
  def render_conversation_view(conversation=nil)
    @conversations = current_user.conversations.order('updated_at DESC')
    @opened_conversation = conversation
    render :index
  end
end
