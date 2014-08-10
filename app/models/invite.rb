class Invite < ActiveRecord::Base
  attr_accessible :email, :user_id, :inviter_id
  validates :user_id, presence: true, numericality: {:only_integer => true}, , uniqueness: { scope: :inviter_id, message: "A user can only invite a specfic person once" }
  validates :inviter_id, presence: true, numericality: {:only_integer => true}


  # Builds an invite.
  # Params:
  # inviter: User object that is creating and invitation
  # invitee_email: The email addy of the person getting invited.
  def self.build(params)
    invite = Invite.new()

    inviter = params[:inviter]

    # Users must have invites left.
    invite.errors.add(:inviter, "Inviter does not have any invites left") and return invite unless inviter.invite_count > 0

    invite.inviter_id = inviter.id

    invitee_email = params[:invitee_email]

    # Find the invited user if they exist
    user = User.find_by_email(invitee_email)

    # Let's create a new user for this invite if we need to.
    user = User.build(:email => invitee_email, :password => SecureRandom.uuid, :creation_source => :invite) if user.nil?

    invite.errors.add(:user, "User could not be found or created")  and return invite if user.errors.count > 0

    invite.user = user

    begin
      UserMailer.activation_needed_email(user).deliver
    rescue
      invite.errors.add(:user, "Could not send invitation email") and return invite
    end

    return invite unless invite.save!

    # Once we secessfully added an invitation, add the inviter to the invitee's contact list, and vice-versa
    contact = user.default_contact_list.contacts.build()
    contact.user = inviter
    contact.save

    contact = inviter.default_contact_list.contacts.build()
    contact.user = user
    contact.save

    # If we've successfully sent an email, we want to remove one of the user's invites.
    inviter.invite_count -= 1
    inviter.save

    invite
  end

end
