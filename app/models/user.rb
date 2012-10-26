class User < ActiveRecord::Base
  attr_accessible :email, :firstname, :lastname, :password,:username
  has_many :ideas
  has_many :projects, :through => :ideas
end
