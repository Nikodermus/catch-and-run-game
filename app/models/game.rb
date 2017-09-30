class Game < ApplicationRecord
    enum difficulty: %w(easy normal hard) 
    belongs_to :user
end
