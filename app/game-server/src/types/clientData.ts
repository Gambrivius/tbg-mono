// control what data gets sent to the client about this object. allows information hiding
// an interface that defines the methods that objects that get serialized to the client must implement
export default interface IClientData<T> {
  getClientData: () => T;
}
