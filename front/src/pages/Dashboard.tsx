import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Select, Input } from "antd";
import Template from "./Template";
import api from "../services/api";

const { Option } = Select;

const Dashboard: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const [clientes, setClientes] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [servicos, setServicos] = useState([]);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await api.get("/clientes");
                setClientes(response.data);
            } catch (error) {
                console.error("Erro ao buscar clientes:", error);
            }
        };

        const fetchProdutos = async () => {
            try {
                const response = await api.get("/produtos");
                setProdutos(response.data);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        };

        const fetchServicos = async () => {
            try {
                const response = await api.get("/servicos");
                setServicos(response.data);
            } catch (error) {
                console.error("Erro ao buscar serviços:", error);
            }
        };

        fetchClientes();
        fetchProdutos();
        fetchServicos();
    }, []);

    const handleAddConsumo = async (values: any) => {
        try {
            const response = await api.post("/consumos", values);
            console.log("Consumo adicionado com sucesso:", response.data);
            form.resetFields();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Erro ao adicionar consumo:", error);
        }
    };

    return (
        <Template title="Dashboard" subtitle="Seja bem-vindo">
            <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
                Adicionar Consumo
            </Button>

            <Modal
                title="Adicionar Consumo"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddConsumo}
                >
                    <Form.Item
                        name="clienteId"
                        label="Cliente"
                        rules={[{ required: true, message: "Por favor, selecione um cliente" }]}
                    >
                        <Select placeholder="Selecione um cliente">
                            {clientes.map((cliente: any) => (
                                <Option key={cliente.id} value={cliente.id}>
                                    {cliente.nome}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="produtoId"
                        label="Produto"
                        rules={[{ required: false, message: "Por favor, selecione um produto" }]}
                    >
                        <Select placeholder="Selecione um produto (opcional)">
                            {produtos.map((produto: any) => (
                                <Option key={produto.id} value={produto.id}>
                                    {produto.nome}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="servicoId"
                        label="Serviço"
                        rules={[{ required: false, message: "Por favor, selecione um serviço" }]}
                    >
                        <Select placeholder="Selecione um serviço (opcional)">
                            {servicos.map((servico: any) => (
                                <Option key={servico.id} value={servico.id}>
                                    {servico.nome}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="quantidade"
                        label="Quantidade"
                        rules={[{ required: true, message: "Por favor, insira a quantidade" }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Salvar
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Template>
    );
};

export default Dashboard;
