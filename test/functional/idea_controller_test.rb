require 'test_helper'

class IdeaControllerTest < ActionController::TestCase
  test "should get showidea" do
    get :showidea
    assert_response :success
  end

end
