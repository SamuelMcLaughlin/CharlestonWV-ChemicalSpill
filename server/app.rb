require 'sinatra'
require 'sinatra/jsonp'
require 'twilio-ruby'
require 'redis'
require 'json'
require 'twilio-ruby'
require 'phone'

configure do
  #Redis
  uri = URI.parse(ENV["REDISCLOUD_URL"])
  $redis = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password)

  #Twilio
  account_sid = "RECACTED"
  auth_token = "RECACTED"
  $client = Twilio::REST::Client.new account_sid, auth_token
  $from = "RECACTED"

  #Phoner
  Phoner::Phone.default_country_code = '1'
  Phoner::Phone.default_area_code = '304'
end

get '/' do
  '<h1>WV Find Water SMS Registration</h1> <b>Twilio </b>' + Twilio::VERSION + '<br><b>WVFWSMS </b> 1.0'
end

# POST /phones
# {
#   number:3045555555
# }
post '/phones' do
  number = (JSON.parse request.body.read)['number']
  handle_phone number
end

# GET /phones?number=3045555555
get '/phones' do
  JSONP handle_phone params['number']
end

# GET /unsubscribe?number=3045555555
get '/unsubscribe' do
  valid = validate_phone params['number']

  if $redis.srem('numbers',valid)
     JSONP {message:"You've been unsubscribed."}.to_json
   else
     JSONP {message:"Unsubscribe failed."}.to_json
   end
end

def handle_phone(number)
  valid = validate_phone number

  if valid
    added = $redis.sadd('numbers', valid)
  else
    {message: "That number doesn't appear to be valid."}.to_json
  end

  if added
    {message: "Got it. We'll send you updates as soon as we know something."}.to_json
  else
    {message: "You've already signed up."}.to_json
  end
end

def validate_phone number
  Phoner::Phone.parse(number.to_s).to_s
end

def message_all text
  count = $redis.scard('numbers')
  errors = []
  $redis.smembers('numbers').each do |value|
    begin
      $client.account.messages.create(
          :from => $from,
          :to => value,
          :body => text
      )
    rescue Twilio::REST::RequestError => e
      errors << {to:value, error:e.message}
    end
  end
  {count:count,errors:errors}
end
