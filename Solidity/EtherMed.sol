pragma solidity ^0.4.21;

//This contract is deployed on the Rinkeby test net at 0x7c7d28633029e7f862282d2bfa1041c1b58944c2
contract EtherMed {
    mapping(address => bool) allowed;
    mapping(address => Doctor) doctors;
    mapping(address => Prescription) prescriptions;

    struct Doctor {
        string name;
        string work_address;
        string phone;
        bool registered;
    }

    struct Prescription {
        string description;
        bool isValid;
    }

    modifier onlyAllowed() {
        require(allowed[msg.sender]);
        _;
    }

    function EtherMed() public {
        allowed[msg.sender] = true;
    }

    function registerDoctor(address _doctorAddr, string _name, string _work_address, string _phone) onlyAllowed payable public {
        doctors[_doctorAddr] = Doctor(_name, _work_address, _phone, true);
    }

    function issuePrescription(string _description) public returns(uint) {
        require(doctors[msg.sender].registered);
        prescriptions[msg.sender] = Prescription(_description, true);
    }

    function payDoctor(uint price, address _doctorAddr) public payable {
        require(prescriptions[_doctorAddr].isValid);
        require(msg.value == price);
        _doctorAddr.transfer(price);
        prescriptions[msg.sender] = prescriptions[_doctorAddr];
        delete prescriptions[_doctorAddr];
    }

    function checkUserType(address _addr) view public returns(string) {
        if(allowed[_addr]) return "admin";
        if(doctors[_addr].registered) return "doctor";
        return "patient";
    }

    function checkPrescription(address _addr) view public returns(string) {
        return prescriptions[_addr].description;
    }

    function consumePrescription(uint price, address _pharmacyAddr) public payable {
        require(prescriptions[msg.sender].isValid);
        require(msg.value == price);
        _pharmacyAddr.transfer(price);
        delete prescriptions[msg.sender];
    }
}
