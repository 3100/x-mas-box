require 'slim'

use Rack::Static,
  :urls => ["/js", "/css"],
  :root => "public"

run lambda { |env|
  [
    200,
    {
      'Content-Type' => 'text/html',
      'Cache-Control' => 'public, max-age=86400'
    },
    [Slim::Template.new('./index.slim', {pretty: true}).render]
  ]
}
