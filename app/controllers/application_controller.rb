class ApplicationController < ActionController::Base
  protect_from_forgery
  
  before_filter :catch_escaped_fragment
  
  protected
  
  def catch_escaped_fragment
    if fragment = params[:_escaped_fragment_]
      # TODO
    end
  end
end
