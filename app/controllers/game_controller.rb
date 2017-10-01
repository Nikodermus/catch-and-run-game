class GameController < ApplicationController
  
	respond_to :html, :json

	def index
		@current_user = User.current_user
	end	

	def create
		@current_user = User.current_user
		@game_current = Game.new(game_params)  
		@game_current.save;
	end

	private 

	def game_params
		params.require(:game).permit(:difficulty)
	end
end
