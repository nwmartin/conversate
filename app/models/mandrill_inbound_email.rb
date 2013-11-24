class MandrillInboundEmail
  CNV_REGEX = /cnv-(\d+)@.*\.watercoolr\.io/

  attr_reader :sender, :action, :conversation

  def initialize(data)
    @data = data
    @sender = User.find_by_email(@data['from_email']) unless @user
    @action = Action.new(
      type: 'email_message',
      data: { text: @data['text'] }.to_json,
      user_id: self.sender_user.id
    )
    CNV_REGEX =~ @data['email']
    match = $1
    @conversation = Conversation.find(match) unless match.nil?
  end

  def to_conversation?
    !@conversation.nil?
  end

  def dispatch_to_conversation
    self.action.save
    self.conversation.actions << self.action
    # TODO: make handle deal with unread counts
    self.conversation.handle action
  end
end
