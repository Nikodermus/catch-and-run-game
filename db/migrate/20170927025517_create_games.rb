class CreateGames < ActiveRecord::Migration[5.1]
  def change
    create_table :games do |t|
      t.integer :score
      t.integer :difficulty
      t.time :duration
      t.date :date
      t.string :img_path

      t.timestamps
    end
  end
end
