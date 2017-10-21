class GameController < ApplicationController
  
	respond_to :html, :json

	def index
		@current_user = User.current_user
	end	

	def create
		#binding.pry
		@current_user = User.find(params[:user_id])
		@game_current = Game.new(
			:score => 0,
			:difficulty => game_params[:difficulty],
			:user_id => params[:user_id])
		@game_current.save
		render json: {game_id: @game_current[:id]}
	end

	def update
		#binding.pry
		@current_user = User.find(params[:user_id])
		@game_current = Game.find(params[:id])
		@duration = @game_current[:created_at] - DateTime.now;
		@game_current.update(
			:score => game_params[:score],
			:user_id => params[:user_id],
			:img_path => game_params[:img_path],
			:duration => @duration	
		)
		render json: true
	end

	private 

	def game_params
		params.require(:game).permit(:img_path, :difficulty, :score, :duration)
	end

	
end
