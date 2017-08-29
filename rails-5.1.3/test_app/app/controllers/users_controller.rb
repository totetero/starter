class UsersController < ApplicationController
  def index
  end

  def show
    @user = Hash.new
    @user[:name] = params[:username]
    @user[:username] = 'hoge'
  end
end
