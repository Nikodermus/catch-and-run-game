class GameController < ApplicationController
  
  respond_to :html, :json

  def index
    @kappa = "hola que hace "
  end

  def create
	@kappa = "holaquehace"
	# Game.create(
	# 	article_params
	# )
	# #binding.pry
	# @article.save
  end
 
  private 
  
  def game_params
      params.require(:game).permit(:difficulty)
  end
end
