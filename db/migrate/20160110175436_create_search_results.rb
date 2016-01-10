class CreateSearchResults < ActiveRecord::Migration[5.0]
  def change
    create_table :search_results do |t|
      t.string :search
      t.string :search_uuid
      t.attachment :document

      t.timestamps
    end
  end
end
