class Project < ActiveRecord::Base
  attr_accessible :description, :title, :user_id
  has_many :ideas
  has_many :users, :through => :ideas
end
