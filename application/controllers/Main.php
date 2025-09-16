<?php 

class Main extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->model('List_user_model');
        $this->load->helper(['url']);
        $this->load->library(['session']);
        $this->load->database();
    }

    public function getAllUser() {
        $users = $this->List_user_model->getAllUser();
        $this->output
            ->set_content_type('application/json; charset=utf8')
            ->set_output(json_encode(['data' => $users], JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));
    }
}

?>