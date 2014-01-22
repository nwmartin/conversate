class TestbedController < ApplicationController
  before_filter :require_login
  before_filter :require_site_admin

  def index
    @views = [
      'conversation',
      'conversation-list',
      'conversation-container',
      'new-conversation',
      'folder',
      'folder-list',
      'folder-container',
      'folder-editor',
      'title-editor',
      'participant-editor',
      'update-folders',
      'action',
      'action-list',
      'compose',
      'action-container',
      'structural-bar',
      'the-whole-app'
    ]
  end

  def test_view
    @view_name = params[:view]
  end
end
