import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import { useEffect, useState } from 'react';
// import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

export default function Ordering() {
    const [showSearch, setShowSearch] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState([]);
    const [customer, setCustomer] = useState();
    const [orders, setOrders] = useState([]);
    const [product, setProduct] = useState();
    const [productPrice, setProductPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [productSelection, setProductSelection] = useState(['']);
    const [searchCustomer, setSearchCustomer] = useState();
    const [searchOrder, setSearchOrder] = useState();

    // const rows: GridRowsProp = [];
    // Object.keys(orders).length > 0 && orders.map((order, index) => {
    //     rows.push(
    //         {
    //             id: index,
    //             col1: order.customer && order.customer.customer_name,
    //             col2: order.order_number,
    //             col3: order.details && order.details.gross_sales,
    //             col4: order.status
    //         }
    //     )
    // });

    // <th>{order.customer && order.customer.customer_name}</th>
    // <th>{order.order_number}</th>
    // <th>{order.status ? <Badge bg="primary">Active</Badge> : <Badge bg="danger">Cancelled</Badge>}</th>
    // <th>{order.details && order.details.gross_sales}</th>
    // {
    //     order.status == 1 ?
    //     <th className="flex gap-2">
    //         <Button variant="warning" onClick={() => handleShowEdit(order)}>Edit</Button>
    //         <Button variant="danger" onClick={() => handleShowDelete(order)}>Cancel</Button>
    //     </th> : <th></th>
    // }
    
    // const columns: GridColDef[] = [
    //     { field: 'col1', headerName: 'Customer Name', width: 150 },
    //     { field: 'col2', headerName: 'Order Number', width: 150 },
    //     { field: 'col3', headerName: 'Status', width: 150 },
    //     { field: 'col4', headerName: 'Gross Sales', width: 150 },
    //     { field: 'col5', headerName: 'Action', width: 150 },
    // ];

    function handleShowSearch() {
        setShowSearch(true)
    }
    
    function handleShowAdd() {
        setShowAdd(true)
    }

    function handleShowEdit(order) {
        setSelectedOrder(order);
        setProduct(order.details && order.details.product_code);
        setProductPrice(order.details && products.find(_p => _p.product_code == order.details.product_code).price)
        setShowEdit(true);
    }

    function handleShowDelete(order) {
        setSelectedOrder(order);
        setShowDelete(true);
    }

    function handleCloseAdd () {
        setProductPrice(0);
        setShowAdd(false);
    }

    function handleCloseEdit () {
        setShowEdit(false);
    }
    
    function handleCloseDelete () {
        setShowDelete(false);
    }

    function handleCloseSearch () {
        setShowSearch(false);
    }

    function fetchData() {
        const getDataUrl = 'http://127.0.0.1:8000/api/getData';
        fetch(getDataUrl, {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            body: JSON.stringify({
                cus_name: searchCustomer ?? '',
                order_number: searchOrder ?? ''
            })
        })
        .then((response) => response.json())
        .then(
            (response) => {
                setCustomers(response.customers);
                setProducts(response.products);
                setOrders(response.orders);
                setShowSearch(false);
                setSearchCustomer('');
                setSearchOrder('');
            }
        )
    }

    function createOrder() {
        const getCreateOrderUrl = 'http://127.0.0.1:8000/api/createOrder';
        fetch(getCreateOrderUrl, {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            body: JSON.stringify({
                cus_code: customer,
                prod_code: product,
                quantity: quantity
            })
        })
        .then((response) => response.json())
        .then(
            (response) => {
                alert(response.message);
                fetchData();
                setProductPrice(0);
            }
        )
        setShowAdd(false);
    }

    function cancelOrder() {
        const getCancelOrderUrl = 'http://127.0.0.1:8000/api/cancelOrder';
        fetch(getCancelOrderUrl, {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            body: JSON.stringify({
                cus_code: selectedOrder.customer_code,
                order_number: selectedOrder.order_number
            })
        })
        .then((response) => response.json())
        .then(
            (response) => {
                alert(response.message);
                fetchData();
            }
        )
        setShowDelete(false);
    }

    function updateOrder() {
        const getUpdateOrderUrl = 'http://127.0.0.1:8000/api/updateOrder';
        fetch(getUpdateOrderUrl, {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            body: JSON.stringify({
                cus_code: selectedOrder.customer_code,
                order_number: selectedOrder.order_number,
                prod_code: product,
                quantity: quantity
            })
        })
        .then((response) => response.json())
        .then(
            (response) => {
                alert(response.message);
                fetchData();
            }
        )
        setShowEdit(false);
    }

    function addProductSelection() {
        setProductSelection([...productSelection, '']);
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div className="h-screen w-auto bg-gray-400 p-10">
            <div className='justify-between flex'>
                <span class="font-bold text-gray-800 text-3xl">
                    Orders
                </span>
                <div>
                    <Button style={{ marginRight: 5 }} variant="success" onClick={handleShowSearch}>Search</Button>
                    <Button variant="primary" onClick={handleShowAdd}>Add New</Button>
                </div>
            </div>

            {/* <DataGrid rows={rows} columns={columns} /> */}
            
            <Table striped bordered hover style={{ marginTop: 15 }}>
                <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>Order Number</th>
                        <th>Status</th>
                        <th>Gross Sales</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(orders).length > 0 && orders.map((order) => {
                            return (
                                <tr>
                                    <th>{order.customer && order.customer.customer_name}</th>
                                    <th>{order.order_number}</th>
                                    <th>{order.status ? <Badge bg="primary">Active</Badge> : <Badge bg="danger">Cancelled</Badge>}</th>
                                    <th>{order.details && order.details.gross_sales}</th>
                                    {
                                        order.status == 1 ?
                                        <th className="flex gap-2">
                                            <Button variant="warning" onClick={() => handleShowEdit(order)}>Edit</Button>
                                            <Button variant="danger" onClick={() => handleShowDelete(order)}>Cancel</Button>
                                        </th> : <th></th>
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>

            <Modal show={showAdd} onHide={handleCloseAdd}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Order</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <span className="font-bold text-xl">Customer</span>
                        <div>
                            <Form.Select aria-label="Default select example" onChange={(e) => setCustomer(e.target.value)}>
                                <option>Select customer...</option>
                                {
                                    Object.keys(customers).length > 0 && customers.map((customer) => {
                                        return (
                                            <option value={customer.customer_code}>{customer.customer_name}</option>
                                        )
                                    })
                                }
                            </Form.Select>
                        </div>
                        <div className="mt-4">
                            <div className="justify-between flex mb-3">
                                <span className="font-bold text-xl">Product</span>
                                {/* <Button variant="success" onClick={addProductSelection}>Add Product</Button> */}
                            </div>
                            <Table responsive bordered>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Object.keys(productSelection).length > 0 && productSelection.map(function() {
                                            return (
                                                <tr>
                                                    <td>
                                                        <Form.Select aria-label="Default select example" onChange={(e) => {
                                                            setProduct(e.target.value);
                                                            const _productPrice = products.find(p => p.product_code == e.target.value).price;
                                                            setProductPrice(_productPrice);
                                                        }}>
                                                            <option>Select product...</option>
                                                            {
                                                                Object.keys(products).length > 0 && products.map((product) => {
                                                                    return (
                                                                        <option value={product.product_code}>{product.product_name}</option>
                                                                    )
                                                                })
                                                            }
                                                        </Form.Select>
                                                    </td>
                                                    <td>
                                                        <span>{productPrice}</span>
                                                    </td>
                                                    <td>
                                                        <Form.Control
                                                            placeholder="Quantity"
                                                            aria-label="Username"
                                                            aria-describedby="basic-addon1"
                                                            onChange={(e) => setQuantity(e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Button variant="danger">Remove</Button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                            <div className="grid justify-items-stretch">
                                <div className="justify-self-end">
                                    <span>Gross Sales: </span> {productPrice * quantity}
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAdd}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={createOrder}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEdit} onHide={handleCloseEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Order</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <div className="justify-between flex mb-3">
                                <span className="font-bold text-xl">Product</span>
                                {/* <Button variant="success" onClick={addProductSelection}>Add Product</Button> */}
                            </div>
                            <Table responsive bordered>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Object.keys(productSelection).length > 0 && productSelection.map(function() {
                                            return (
                                                <tr>
                                                    <td>
                                                        <Form.Select aria-label="Default select example" value={product} onChange={(e) => {
                                                            setProduct(e.target.value);
                                                            const _productPrice = products.find(p => p.product_code == e.target.value).price;
                                                            setProductPrice(_productPrice);
                                                        }}>
                                                            <option>Select product...</option>
                                                            {
                                                                Object.keys(products).length > 0 && products.map((product) => {
                                                                    return (
                                                                        <option value={product.product_code}>{product.product_name}</option>
                                                                    )
                                                                })
                                                            }
                                                        </Form.Select>
                                                    </td>
                                                    <td>{ productPrice }</td>
                                                    <td>
                                                        <Form.Control
                                                            placeholder="Quantity"
                                                            aria-label="Username"
                                                            aria-describedby="basic-addon1"
                                                            onChange={(e) => setQuantity(e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Button variant="danger">Remove</Button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                            <div className="grid justify-items-stretch">
                                <div className="justify-self-end">
                                    <span>Gross Sales: </span> {productPrice > 0 && quantity > 0 ? productPrice * quantity : 0}
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEdit}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={updateOrder}>
                        Edit
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDelete} onHide={handleCloseDelete}>
                <Modal.Header closeButton>
                <Modal.Title>Cancel Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span>Are you sure you want to cancel this order?</span>
                    <div className="pt-3">
                        <p className="font-bold">Order Details:</p>
                        <ul>
                            <li>Customer Name: <b>{Object.keys(selectedOrder).length > 1 ? selectedOrder.customer.customer_name : ''}</b></li>
                            <li>Order Number: <b>{Object.keys(selectedOrder).length > 1 ? selectedOrder.order_number : ''}</b></li>
                        </ul>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseDelete}>
                    No
                </Button>
                <Button variant="primary" onClick={cancelOrder}>
                    Yes
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showSearch} onHide={handleCloseSearch}>
                <Modal.Header closeButton>
                <Modal.Title>Search Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        className="mb-3"
                        placeholder="Customer Name"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        onChange={(e) => setSearchCustomer(e.target.value)}
                    />
                    <Form.Control
                        placeholder="Order Number"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        onChange={(e) => setSearchOrder(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseSearch}>
                    No
                </Button>
                <Button variant="primary" onClick={fetchData}>
                    Search
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}