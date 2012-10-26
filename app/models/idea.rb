class Idea < ActiveRecord::Base
  attr_accessible :detail, :project_id, :title, :user_id ,:ancestor
  belongs_to :project
  belongs_to :user
  belongs_to :idea
end
