class User < ActiveRecord::Base
  authenticates_with_sorcery!

  has_many :reading_logs
  has_many :conversations, :through => :reading_logs
  has_many :events, :inverse_of => :user
  has_and_belongs_to_many :topics

  attr_accessible :email, :password, :password_confirmation

  validates_confirmation_of :password
  validates_presence_of :password, :on => :create
  validates_presence_of :email
  validates_uniqueness_of :email

  def name
    full_name || email
  end

  def mark_as_read(conversation)
    if conversation.events.length > 0
      reading_log = conversation.reading_logs.where({:user_id => self.id}).first
      reading_log.last_read_event = conversation.events.order('created_at DESC').first.id
      reading_log.save!
    end
  end

  def unread_count
    self.conversations.keep_if {|c| c.unread_for?(self) }.length
  end

  # Public: returns the users this user knows.
  # Note - currently everyone is assumed to know everyone else.  Fix this at
  # some future date.
  def address_book
    return User.all - [self]
  end

  # This avoids us writing out passwords, salts, etc. when rendering json.
  def as_json(options={})
    super(:only => [:email, :full_name, :id])
  end
end
