class Api::V0::ContactListsController < ApplicationController
  before_filter :require_login_api

  def index
    render :status => :error
  end

  def create
    render :status => :error
  end

  def update
    @contact_list = ContactList.find(params[:id])
    if(params[:contact_list][:name])
      @contact_list.name = params[:contact_list][:name]
    end
    if @contact_list.save
      # do this better later
      @contact_list.participants.clear
      params[:participants].each{ |p| @contact_list.participants.build(:user_id => p[:id]).save}
      render :json => @contact_list
    else
      render :json => @contact_list.errors, :status => :error
    end
  end

  def show
    render :status => :error
  end

end
