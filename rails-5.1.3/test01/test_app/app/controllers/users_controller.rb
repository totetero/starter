class UsersController < ApplicationController
  def index
  end

  def show
    @user = User.find_by(:name => params[:username])
    if @user.blank?
      @user = Hash.new
      @user[:name] = 'none'
      @user[:username] = 'none'
    end
    @tweets = Tweet.all
  end

  def new
  end

  def create
    @tweet = Tweet.new
    @tweet.title = params[:tweet][:title]
    @tweet.content = params[:tweet][:content]
    @tweet.save
    redirect_to '/users/index'
  end
end
