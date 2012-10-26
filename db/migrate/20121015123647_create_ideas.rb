class CreateIdeas < ActiveRecord::Migration
  def change
    create_table :ideas do |t|
      t.integer :user_id
      t.integer :project_id
      t.string :title
      t.string :detail

      t.timestamps
    end
  end
end
