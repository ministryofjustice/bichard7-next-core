group "Home Office" {
  pnc = softwareSystem "PNC" "Police National Computer" {
    tags "Home Office" "Police System"
  }
  leds = softwareSystem "LEDS" "Law Enforcement Data System" {
    tags "Home Office" "Police System"
  }
  niam = softwareSystem "NIAM" "National Identity Access Management service" {
    tags "Home Office" "API"
  }
}
