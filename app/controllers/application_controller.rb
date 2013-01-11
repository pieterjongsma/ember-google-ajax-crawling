class ApplicationController < ActionController::Base
  protect_from_forgery
  
  before_filter :catch_escaped_fragment
  
  protected
  
  def catch_escaped_fragment
    if fragment = params[:_escaped_fragment_]
      # Build the original url
      base_url = "#{request.protocol}#{request.host_with_port}#{request.path}"
      url_with_hash = "#{base_url}#!#{params[:_escaped_fragment_]}"
      
      # Render it with the PhantomJS script and return the result
      command = "phantomjs '#{Rails.root}/lib/phantomjs/ember_to_static.js' '#{url_with_hash}' silence"
      result = `#{command}`
      
      render text: result
    end
  end
end
