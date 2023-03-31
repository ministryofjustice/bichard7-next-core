# Offence matching algorithm

Bichard receives court results and needs to update offences on the PNC with these results.
Unfortunately, for unknown reasons, the ID to use on the PNC for updating is not included in the message from the court. This means that we need to work out which offence in the PNC matches which offence in the court result. There are some complications to this, however:

- Offences may be added in the court
- The data for offences coming from the courts may not match those in the PNC
- There may be offences with identical details (date, offence code, etc)
- Offences from the court may be from two separate court cases in the PNC

The original algorithm in Bichard to do this matching was extremely complex. We are aiming to simplify it. As we understand it, the algorithm is:

For each PNC ccourt case:
- Try to match offences that fully match (sequence number, offence code, dates) within the same PNC court case
- Try to match remaining offences ignoring the sequence number within the same PNC court case

If there are matches in multiple cases:
- If they don't conflict, then merge them as a multiple court case match
- If they do conflict, then raise an exception

Exceptions to raise are:
