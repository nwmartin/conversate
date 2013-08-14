class Group < ActiveRecord::Base
  has_many :group_participations
  has_many :users, :through => :group_participations

  attr_accessible :name
end