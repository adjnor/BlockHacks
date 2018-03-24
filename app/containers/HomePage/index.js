/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import styled from 'styled-components';
import Navbar from 'components/Navbar';
import abiJson from './abi.json';

// let web3js;

// Checking if Web3 has been injected by the browser (Mist/MetaMask)
// if (typeof web3 !== 'undefined') {
//   // Use Mist/MetaMask's provider
//   web3js = new Web3(web3.currentProvider);
// } else {
//   console.log('No web3? You should consider trying MetaMask!');
// }

let myAddress;
web3.eth.getAccounts((error, accounts) => {
  myAddress = accounts[0];
  console.log(myAddress);
});

const contract = web3.eth
  .contract(abiJson)
  .at('0x7c7d28633029e7f862282d2bfa1041c1b58944c2');

const Wrapper = styled.div`
  background: #fafafa;
`;

const Jumbo = styled.div`
  min-height: 100vh;
  text-align: center;
  background: #61bee7;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 15px 25px;
  background: #4a90e2;
  border-radius: 4px;
  color: #fff;
  font-size: 1.2rem;
  box-shadow: inset 0px 0px 0px 0px #0a6cbb;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
  outline: none;
  &:hover {
    box-shadow: inset 0px -3px 0px 0px #0a6cbb;
  }
  &:active {
    box-shadow: inset 0px 1px 1px 1px #0a6cbb;
  }
`;

const Info = styled.div`
  display: flex;
  justify-content: center;
`;

const Logo = styled.img`
  max-width: 200px;
  border-radius: 50%;
`;

const Headline = styled.h1`
  color: #fff;
`;

const Input = styled.input`
  padding: 10px;
  border: 2px solid rgb(96, 190, 232);
  border-radius: 4px;
  margin-bottom: 10px;
  width: 100%;
`;

export default class HomePage extends React.PureComponent {
  constructor() {
    super();
    this.state = { userType: '', prescription: '' };
  }
  getInfo = () => {
    this.getUserType(myAddress);
    this.checkPrescription(myAddress);
  };
  getUserType = (addr) => {
    console.log(addr);
    contract.checkUserType(addr, (err, res) => {
      console.log(res);
      if (this.state.userType === '') this.setState({ userType: res });
    });
  };
  checkPrescription = (addr) => {
    contract.checkPrescription(addr, (err, res) => {
      console.log(res);
      this.setState({ prescription: res });
    });
  };
  registerDoctor = (addr, name, workAddress, phone) => {
    console.log(addr, name, workAddress, phone);
    contract.registerDoctor(addr, name, workAddress, phone, (err, res) => {
      console.log(res);
    });
  };
  issuePrescription = (description) => {
    contract.issuePrescription(description, (err, res) => {
      console.log(res);
    });
  };
  payDoctor = (price, addr) => {
    contract.payDoctor(price, addr, (err, res) => {
      console.log(res);
    });
  };
  renderForm = () => {
    switch (this.state.userType) {
      case 'admin':
        return (
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                this.registerDoctor(
                  this.docAddr.value,
                  this.docName.value,
                  this.docWorkAddr.value,
                  this.docPhone.value
                );
              }}
            >
              <h2>Register a doctor</h2>
              <div>
                <Input
                  type="text"
                  name="address"
                  placeholder="Eth address"
                  innerRef={(ref) => {
                    this.docAddr = ref;
                  }}
                />
              </div>
              <div>
                <Input
                  type="text"
                  name="name"
                  placeholder="Name"
                  innerRef={(ref) => {
                    this.docName = ref;
                  }}
                />
              </div>
              <div>
                <Input
                  type="text"
                  name="work_address"
                  placeholder="Address"
                  innerRef={(ref) => {
                    this.docWorkAddr = ref;
                  }}
                />
              </div>
              <div>
                <Input
                  type="phone"
                  name="phone"
                  placeholder="Phone"
                  innerRef={(ref) => {
                    this.docPhone = ref;
                  }}
                />
              </div>
              <div>
                <Button>Submit</Button>
              </div>
            </form>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                this.getUserType(this.lookupAddr.value);
              }}
            >
              <h2>Check user type</h2>
              <div>
                <Input
                  type="text"
                  name="address"
                  placeholder="Eth address"
                  innerRef={(ref) => {
                    this.lookupAddr = ref;
                  }}
                />
                <Button>Submit</Button>
              </div>
            </form>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                this.checkPrescription(this.prescriptionAddr.value);
              }}
            >
              <h2>Check user prescription</h2>
              <div>
                <Input
                  type="text"
                  name="prescription address"
                  placeholder="User address"
                  innerRef={(ref) => {
                    this.prescriptionAddr = ref;
                  }}
                />
                <Button>Submit</Button>
              </div>
            </form>
          </div>
        );
      case 'doctor':
        return (
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                this.issuePrescription(this.prescriptionDesc.value);
                this.checkPrescription(myAddress);
              }}
            >
              <h2>Create a prescription</h2>
              <div>
                <Input
                  type="text"
                  name="prescription"
                  placeholder="Description"
                  innerRef={(ref) => {
                    this.prescriptionDesc = ref;
                  }}
                />
              </div>
              <div>
                <Button>Submit</Button>
              </div>
            </form>
            {this.state.prescription !== '' && (
              <h2>Prescription issued: {this.state.prescription}</h2>
            )}
          </div>
        );
      case 'patient':
        return (
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                this.payDoctor(this.doctorFee.value, this.docPayAddress.value);
                this.checkPrescription(myAddress);
              }}
            >
              <h2>Pay a doctor</h2>
              <div>
                <Input
                  type="text"
                  name="price_doctor"
                  placeholder="Doctor fee"
                  innerRef={(ref) => {
                    this.doctorFee = ref;
                  }}
                />
              </div>
              <div>
                <Input
                  type="text"
                  name="doctor_address"
                  placeholder="Doctor address"
                  innerRef={(ref) => {
                    this.docPayAddress = ref;
                  }}
                />
              </div>
              <div>
                <Button>Submit</Button>
              </div>
            </form>
            {this.state.prescription !== '' && (
              <h2>Current prescription: {this.state.prescription}</h2>
            )}
          </div>
        );
      default:
        return null;
    }
  };
  render() {
    return (
      <Wrapper>
        {this.state.userType === '' && (
          <Jumbo>
            <Navbar />
            <Logo
              src="http://adisabilitylawyer.com/adl/uploads/2015/05/medical-records-5.21.15.jpg"
              alt="jumbo logo"
            />
            <Headline>A new home for your medical records</Headline>
            <Button onClick={this.getInfo}>Get started</Button>
          </Jumbo>
        )}
        <Info>
          {this.state.userType !== '' && (
            <div>
              <h2>Hi {this.state.userType}</h2>
              {this.renderForm()}
            </div>
          )}
        </Info>
      </Wrapper>
    );
  }
}
