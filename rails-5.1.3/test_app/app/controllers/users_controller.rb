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
  end

  def new
  end
end
