class CreateGames < ActiveRecord::Migration[5.1]
  def change
    create_table :games do |t|
      t.integer :score
      t.string :difficulty
      t.string :image
      t.time :duration
      t.date :date
      t.string :img

      t.timestamps
    end
  end
end
