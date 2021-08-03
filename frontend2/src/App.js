import React, {
  useState
} from 'react';
import Web3 from 'web3';
import { contractAbi } from './abi';
import 'bootstrap/dist/css/bootstrap.css';
import { 
  Navbar,
  Container,
  Button,
  Card,
  Col,
  Row,
  Badge,
  Modal,
  Form,
  InputGroup,
  FormGroup
} from 'react-bootstrap';
import placeholder from './placeholder.jpg';
import './App.css';

const web3 = new Web3(Web3.givenProvider);  // use the given Provider or instantiate a new websocket provider
const contractAddress = '0xB25e8Ed44c255466b22cc9d672E3d66c0Dd615Ee'; // ropsten contract address
const contract = new web3.eth.Contract(contractAbi, contractAddress); // create contract object

function App() {
  // react hooks
  const [walletAddress, setWalletAddress] = useState('');
  const [walletState, setWalletState] = useState(false);
  const [organisations, setOrganisations] = useState([]);
  const [ownerModalShow, setOwnerModalShow] = useState(false);
  const [storeModalShow, setStoreModalShow] = useState(false);
  const [balance, setBalance] = useState('');

  const connectWallet = async (e) => {
    try {
      // get ethereum account
      var accounts = await window.ethereum.enable();
      var account = accounts[0];

      // set address hooks
      setWalletState(true);
      setWalletAddress(account);

      fetchOrganisations(); // populate organisation array

      // get owner ethereum address
      const owner = await contract.methods.owner().call();
      if (account.toLowerCase() === owner.toLowerCase()) {
        // if user is contract owner, get balance of contract and show the admin dashboard 
        const contractBalance = await contract.methods.balance().call();
        setBalance(contractBalance);
        setOwnerModalShow(true);
      }

    } catch {
      setWalletAddress('Unable to connect to wallet');  // update hook
    }
  }

  const fetchOrganisations = async (e) => {
    // get array of all registered organisations
    var result = await contract.methods.getOrganisations().call();
    result = result.filter(elem => elem['valid']);
    setOrganisations(result); // update hook
  }

  const storeLogin = async(e) => {
    // if user is a registered organisation, show the store dashboard
    for (let elem of organisations) {
      if (elem['organisationAddress'].toLowerCase() === walletAddress.toLowerCase()) {
        setStoreModalShow(true);  // update hook
        break;
      }
    }
  }

  const addStock = async(e) => {
    e.preventDefault();

    // get data from submitted form
    const formData = new FormData(e.target), formDataObj = Object.fromEntries(formData.entries());
    var amount = formDataObj['stockInput'];

    // call addBags contract function
    await contract.methods.addBags(amount).send({ from: walletAddress });

    e.target.reset();
  }

  const updateDescription = async(e) => {
    e.preventDefault();

    // get data from submitted form
    const formData = new FormData(e.target), formDataObj = Object.fromEntries(formData.entries());
    var description = formDataObj['descriptionInput'];

    // call updateBagDescription contract function
    await contract.methods.updateBagDescription(description).send({ from: walletAddress });

    e.target.reset();
  }

  const updatePrice = async(e) => {
    e.preventDefault();

    // get data from submitted form
    const formData = new FormData(e.target), formDataObj = Object.fromEntries(formData.entries());
    var price = web3.utils.toWei(formDataObj['priceInput']);

    // call updateBagPrice contract function
    await contract.methods.updateBagPrice(price).send({ from: walletAddress });

    e.target.reset();
  }

  const updateValue = async(e) => {
    e.preventDefault();

    // get data from submitted form
    const formData = new FormData(e.target), formDataObj = Object.fromEntries(formData.entries());
    var value = web3.utils.toWei(formDataObj['valueInput']);

    // call updateBagValue contract function
    await contract.methods.updateBagValue(value).send({ from: walletAddress });

    e.target.reset();
  }

  const addOrganisation = async(e) => {
    e.preventDefault();

    // get data from submitted form
    const formData = new FormData(e.target), formDataObj = Object.fromEntries(formData.entries());
    var address = formDataObj['addressInput'];
    var name = formDataObj['nameInput'];
    var phone = formDataObj['phoneInput'];
    var location = formDataObj['locationInput'];
    var price = web3.utils.toWei(formDataObj['priceInput']);
    var value = web3.utils.toWei(formDataObj['valueInput']);
    var description = formDataObj['descriptionInput'];

    // call addOrganisation contract function
    await contract.methods.addOrganisation(
      address,
      name,
      phone,
      location,
      price,
      value,
      description
      ).send({ from: walletAddress });

    e.target.reset();
  }

  const removeOrganisation = async(e) => {
    e.preventDefault();

    // get data from submitted form
    const formData = new FormData(e.target), formDataObj = Object.fromEntries(formData.entries());
    var address = formDataObj['addressInput'];

    // call removeOrganisation contract function
    await contract.methods.removeOrganisation(address).send({ from: walletAddress });

    e.target.reset();
  }

  const transferOwnership = async(e) => {
    e.preventDefault();

    // get data from submitted form
    const formData = new FormData(e.target), formDataObj = Object.fromEntries(formData.entries());
    var address = formDataObj['addressInput'];

    // call transferOwnership contract function
    await contract.methods.transferOwnership(address).send({ from: walletAddress });

    e.target.reset();
  }

  const purchaseBags = async(e) => {
    e.preventDefault();

    // get data from submitted form
    const formData = new FormData(e.target), formDataObj = Object.fromEntries(formData.entries());
    var quantity = formDataObj['amountInput'];
    var address = e.target.getAttribute('id').substring(0,42);
    var price = e.target.getAttribute('id').substring(42);
    price = parseInt(price) * quantity; // multiply quantity by price per unit to find total amount due

    // call buy contract function
    await contract.methods.buy(address, quantity).send({ from: walletAddress, value: price });

    e.target.reset();
  }

  const withdrawFunds = async(e) => {
    e.preventDefault();

    // get data from submitted form
    const formData = new FormData(e.target), formDataObj = Object.fromEntries(formData.entries());
    var amount = web3.utils.toWei(formDataObj['amountInput']);

    // call withdraw contract function
    await contract.methods.withdraw(amount).send({ from: walletAddress });

    e.target.reset();
  }

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand>
            Farechain 
          </Navbar.Brand>
          <span className="navbar-text text-right py-0">
            { !walletState && (
              <Button
                variant="primary"
                type="button" 
                onClick={ connectWallet }
                block >
                  <p className="mb-0">
                    Connect MetaMask Wallet
                  </p>
              </Button>
            )}
            { walletAddress }
            <Button
              className="shadow-none mb-1"
              style={{
                color: "#6c757d"
              }}
              variant="link"
              type="button" 
              onClick={() => storeLogin()}
              block >
                <p className="mb-0">
                  Store login
                </p>
            </Button>
          </span>
        </Container>
      </Navbar>
      <Container fluid>
        <Row className="px-1">
          {organisations.map((organisation) => (
            <Col sm={3}>
              <Card className="mt-3">
                <Card.Img className="card-image" variant="top" src={ placeholder } />
                <Card.ImgOverlay>
                  <Card.Title className="text-end">
                    <Badge className="text-dark">{ organisation['totalBags'] } left</Badge>
                  </Card.Title>
                </Card.ImgOverlay>
                <Card.Body>
                  <Card.Title>{ organisation['organisationName'] }</Card.Title>
                  <Card.Subtitle>
                    <strong>Ξ{ web3.utils.fromWei(organisation['bagPrice']) }</strong> 
                    {' '}
                    <strike>Ξ{ web3.utils.fromWei(organisation['bagValue']) }</strike>
                  </Card.Subtitle>
                  <Card.Subtitle className="pt-2">{ organisation['bagDescription'] }</Card.Subtitle>
                  <Card.Text className="pt-2 mb-0">
                    { organisation['organisationLocation'] }
                  </Card.Text>
                  <Card.Text>
                    { organisation['organisationPhone'] }
                  </Card.Text>
                  <Form
                    id={ organisation['organisationAddress'] + organisation['bagPrice'] }
                    onSubmit={ purchaseBags }>
                    <InputGroup
                      className="mb-1">
                      <Form.Control
                        type="number"
                        min="1"
                        max="65535"
                        name="amountInput"
                        placeholder="Enter number of bags to purchase" />
                      <InputGroup.Append>
                        <Button
                          className="px-5"
                          variant="success"
                          type="submit" >
                            <p className="mb-0">Buy</p>
                        </Button>
                      </InputGroup.Append>
                    </InputGroup>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <Modal
        size="lg"
        show={ storeModalShow }
        onHide={() => setStoreModalShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Store Dashboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={ addStock }>
            <Form.Label>Add new stock</Form.Label>
            <InputGroup
              className="mb-1">
              <Form.Control
                type="number"
                min="1"
                max="65535"
                name="stockInput"
                placeholder="Enter number of new units" />
              <InputGroup.Append>
                <Button
                  className="px-5"
                  variant="primary"
                  type="submit" >
                    <p className="mb-0">Add</p>
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Form>
          <Form
            onSubmit={ updateDescription }>
            <Form.Label className="pt-3">Update item description</Form.Label>
            <InputGroup
              className="mb-1">
              <Form.Control
                type="text"
                name="descriptionInput"
                placeholder="Enter new description" />
              <InputGroup.Append>
                <Button
                  className="px-5"
                  variant="primary"
                  type="submit" >
                    <p className="mb-0">Update</p>
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Form>
          <Form
            onSubmit={ updatePrice }>
            <Form.Label className="pt-3">Update item price</Form.Label>
            <InputGroup
              className="mb-1">
              <Form.Control
                type="number"
                min="0"
                step="0.0001"
                name="priceInput"
                placeholder="Enter new price" />
              <InputGroup.Append>
                <Button
                  className="px-5"
                  variant="primary"
                  type="submit" >
                    <p className="mb-0">Update</p>
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Form>
          <Form
            onSubmit={ updateValue }>
            <Form.Label className="pt-3">Update item value</Form.Label>
            <InputGroup
              className="mb-1">
              <Form.Control
                type="number"
                min="0"
                step="0.0001"
                name="valueInput"
                placeholder="Enter new value" />
              <InputGroup.Append>
                <Button
                  className="px-5"
                  variant="primary"
                  type="submit" >
                    <p className="mb-0">Update</p>
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        size="lg"
        show={ ownerModalShow }
        onHide={() => setOwnerModalShow(false)}
      >
        <Modal.Header closeButton>
          <Row>
            <Modal.Title>Admin Dashboard</Modal.Title>
            <p className="mb-0"><strong>Balance: Ξ{ web3.utils.fromWei(balance) }</strong></p>
          </Row>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={ addOrganisation }>
            <Form.Label column="lg" className="py-0">Add new organisation</Form.Label>
            <hr className="my-0"/>
            <Form.Label className="pt-0">Ethereum address</Form.Label>
            <FormGroup>
              <Form.Control
                type="text"
                name="addressInput"
                placeholder="Enter organisation's Ethereum address"
                />
            </FormGroup>
            <Form.Label className="pt-0">Name</Form.Label>
            <FormGroup>
              <Form.Control
                type="text"
                name="nameInput"
                placeholder="Enter organisation name"
                />
            </FormGroup>
            <Form.Label className="pt-0">Phone number</Form.Label>
            <FormGroup>
              <Form.Control
                type="text"
                name="phoneInput"
                placeholder="Enter organisation's phone number"
                />
            </FormGroup>
            <Form.Label className="pt-0">Location address</Form.Label>
            <FormGroup>
              <Form.Control
                type="text"
                name="locationInput"
                placeholder="Enter organisation's location address"
                />
            </FormGroup>
            <Form.Label className="pt-0">Bag description</Form.Label>
            <FormGroup>
              <Form.Control
                type="text"
                name="descriptionInput"
                placeholder="Enter bag description"
                />
            </FormGroup>
            <Form.Label className="pt-0">Bag price</Form.Label>
            <FormGroup>
              <Form.Control
                type="number"
                min="0"
                step="0.0001"
                name="priceInput"
                placeholder="Enter price of each bag"
                />
            </FormGroup>
            <Form.Label className="pt-0">Bag value</Form.Label>
            <FormGroup>
              <Form.Control
                type="text"
                name="valueInput"
                placeholder="Enter value of each bag"
                />
            </FormGroup>
            <div className="d-grid gap-2">
              <Button
                className="mt-3"
                variant="primary"
                type="submit"
                block >
                  <p className="mb-0">Add</p>
              </Button>
            </div>
          </Form>
          <Form
            onSubmit={ removeOrganisation }>
            <Form.Label column="lg" className="py-0">Remove organisation</Form.Label>
            <InputGroup
              className="mb-1">
              <Form.Control
                type="text"
                name="addressInput"
                placeholder="Enter organisation's Ethereum address" />
              <InputGroup.Append>
                <Button
                  className="px-5"
                  variant="danger"
                  type="submit" >
                    <p className="mb-0">Remove</p>
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Form>
          <Form
            onSubmit={ transferOwnership }>
            <Form.Label column="lg" className="py-0">Transfer contract ownership</Form.Label>
            <InputGroup
              className="mb-1">
              <Form.Control
                type="text"
                name="addressInput"
                placeholder="Enter new owner's Ethereum address" />
              <InputGroup.Append>
                <Button
                  className="px-5"
                  variant="danger"
                  type="submit" >
                    <p className="mb-0">Transfer</p>
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Form>
          <Form
            onSubmit={ withdrawFunds }>
            <Form.Label column="lg" className="py-0">Withdraw contract funds</Form.Label>
            <InputGroup
              className="mb-1">
              <Form.Control
                type="number"
                min="0.00001"
                max={ web3.utils.fromWei(balance) }
                step="0.00001"
                name="amountInput"
                placeholder="Enter the amount to withdraw" />
              <InputGroup.Append>
                <Button
                  className="px-5"
                  variant="success"
                  type="submit" >
                    <p className="mb-0">Withdraw</p>
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Form>
        </Modal.Body>
      </Modal>            
      { !walletState && (
        <div style={{
          padding: "10rem 15rem",
          marginBottom: "2rem",
          backgroundColor: "#e9ecef",
          borderRadius: ".3rem",
        }}>
          <h2 className="text-center">Please connect your Ethereum wallet with MetaMask by clicking the button in the top right corner</h2>
        </div>
      )}
    </>
  );
}

export default App;
