class SessionsController < ApplicationController
  def create
    user = User.find_by_email(params[:email])
    if !user || user.removed || user.external
      @login_error = true
      redirect_to root_path and return
    end

    user = login params[:email], params[:password], params[:remember_me]
    if user
      redirect_back_or_to root_url
    else
      @login_error = true
      redirect_to root_path
    end
  end

  def destroy
    logout
    redirect_to root_url
  end
end
