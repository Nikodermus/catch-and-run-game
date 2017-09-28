class Game < ApplicationRecord
    enum difficulty: %w(easy normal hard)
end
