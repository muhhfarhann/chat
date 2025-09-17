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
        if($users){
            $this->output
                ->set_content_type('application/json; charset=utf8')
                ->set_output(json_encode(['data' => $users], JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));
        }else{
            $this->output
            ->set_content_type('application/json; charset=utf')
            ->set_output(json_encode(['data' => 'User Not logged in'], JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));
        }
    }

    public function getAllRooms() {
        // pastikan hanya admin yang dapat akses
        if ($this->session->user_data('role') !== 'admin') {
            $this->output
            ->set_status_header(403)
            ->set_content_type('application/json')
            ->set_output(json_encode(['error' => 'Access denied']));
            return;
        }

        $rooms = $this->List_user_model->getAllRooms();
        if ($rooms) {
            $this->output
            ->set_content_type('application/json; charset=utf8')
            ->set_output(json_encode(['data' => $rooms], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        }else{
            $this->output
            ->set_content_type('application/json; charset=utf8')
            ->set_output(json_encode(['data' => []], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        }
    }

    public function createRoom() {
        if ($this->session->userdata('role') !== 'admin') {
            $this->output
                ->set_status_header(403)
                ->set_content_type('application/json')
                ->set_output(json_encode(['error' => 'Access denied']));
            return;
        }

        $title = $this->input->post('title', TRUE);
        $user_id = $this->session->userdata('id');

        $this->db->insert('conversations', [
            'title' => $title,
            'created_by' => $user_id,
            'last_message' => ''
        ]);

        $conversation_id = $this->db->insert_id();
        $this->db->insert('conversation_members', [
            'conversation_id' => $conversation_id,
            'user_id' => $user_id,
            'role' => 'owner',
            'notification_level' => 1
        ]);

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode(['data' => ['id' => $conversation_id, 'title' => $title]]));
    }
}

?>