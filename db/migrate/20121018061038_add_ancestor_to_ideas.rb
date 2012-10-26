class AddAncestorToIdeas < ActiveRecord::Migration
  def change
    add_column :ideas, :ancestor, :integer
  end
end
